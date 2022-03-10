import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/app/const_names.dart';
import 'package:mobileapp/screens/settings/notifications/bloc/notifications_bloc.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';
import 'package:notifications_repository/notifications_repository.dart';
import 'package:rive/rive.dart';

class NotificationsSection extends StatelessWidget {
  const NotificationsSection({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SidePadding(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          _title,
          const _Selectors(),
        ],
      ),
    );
  }

  Widget get _title => Padding(
        padding: EdgeInsets.only(bottom: 20.w),
        child: Text(
          "Notifications",
          style: TextStyle(
            fontFamily: AppFonts.londrina,
            fontSize: 36.sp,
            color: AppColors.textColor,
          ),
        ),
      );
}

class _Selectors extends StatelessWidget {
  const _Selectors({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        BlocBuilder<NotificationsBloc, NotificationsState>(
          buildWhen: (previousState, state) {
            if (previousState.status.isInitial) return true;

            if (previousState.onAuctionEnd != state.onAuctionEnd) {
              return true;
            } else {
              return false;
            }
          },
          builder: (context, state) {
            if (state.status.isSuccess) {
              return _Selector(
                type: NotificationTopics.onAuctionEnd.name,
                text: "On auction end",
                value: state.onAuctionEnd,
                onChange: (newValue) {
                  context
                      .read<NotificationsBloc>()
                      .add(NotificationsTopicStateChanged(
                        topic: NotificationTopics.onAuctionEnd,
                        value: newValue,
                      ));
                },
              );
            }
            return const Text("Error loading the data");
          },
        ),
        SizedBox(height: 10.h),
        BlocBuilder<NotificationsBloc, NotificationsState>(
          buildWhen: (previousState, state) {
            if (previousState.status.isInitial) return true;

            if (previousState.tenMinutesBeforeEnd !=
                state.tenMinutesBeforeEnd) {
              return true;
            } else {
              return false;
            }
          },
          builder: (context, state) {
            if (state.status.isSuccess) {
              return _Selector(
                type: NotificationTopics.tenMinutesBeforeEnd.name,
                text: "10 min before end",
                value: state.tenMinutesBeforeEnd,
                onChange: (newValue) {
                  context
                      .read<NotificationsBloc>()
                      .add(NotificationsTopicStateChanged(
                        topic: NotificationTopics.tenMinutesBeforeEnd,
                        value: newValue,
                      ));
                },
              );
            }
            return const Text("Error loading the data");
          },
        ),
        SizedBox(height: 10.h),
        BlocBuilder<NotificationsBloc, NotificationsState>(
          buildWhen: (previousState, state) {
            if (previousState.status.isInitial) return true;

            if (previousState.fiveMinutesBeforeEnd !=
                state.fiveMinutesBeforeEnd) {
              return true;
            } else {
              return false;
            }
          },
          builder: (context, state) {
            if (state.status.isSuccess) {
              return _Selector(
                type: NotificationTopics.fiveMinutesBeforeEnd.name,
                text: "5 min before end",
                value: state.tenMinutesBeforeEnd,
                onChange: (newValue) {
                  context
                      .read<NotificationsBloc>()
                      .add(NotificationsTopicStateChanged(
                        topic: NotificationTopics.fiveMinutesBeforeEnd,
                        value: newValue,
                      ));
                },
              );
            }
            return const Text("Error loading the data");
          },
        ),
      ],
    );
  }
}

class _Selector extends StatefulWidget {
  const _Selector({
    Key? key,
    this.type,
    required this.text,
    required this.value,
    required this.onChange,
  }) : super(key: key);

  final String text;
  final bool value;
  final Function(bool) onChange;
  final String? type;

  @override
  __SelectorState createState() => __SelectorState();
}

class __SelectorState extends State<_Selector> {
  /// Boolean state to control switch look and change animation
  SMIBool? _on;

  late bool _value;

  @override
  void initState() {
    _value = widget.value;
    super.initState();
  }

  void _onRiveInit(Artboard artboard) {
    final controller = _value
        ? StateMachineController.fromArtboard(
            artboard,
            RiveStateMachines.onSwitch,
          )
        : StateMachineController.fromArtboard(
            artboard,
            RiveStateMachines.offSwitch,
          );

    artboard.addController(controller!);
    _on = controller.findInput<bool>(RiveStateMachines.onInstance) as SMIBool;
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          widget.text,
          style: TextStyle(
            fontSize: 24.sp,
            color: AppColors.textColor,
            fontWeight: FontWeight.w500,
          ),
        ),
        GestureDetector(
          onTap: () {
            setState(() {
              _value = !_value;
              _on?.change(_value);
              widget.onChange(_value);
            });
          },
          child: Container(
            padding: EdgeInsets.only(
              top: 10.w,
              left: 10.w,
              bottom: 10.w,
            ),
            color: AppColors.transparent,
            height: 55.w,
            width: 85.w,
            child: RiveAnimation.asset(
              RivePaths.settingsSwitch,
              animations: const [''],
              onInit: _onRiveInit,
              fit: BoxFit.fitHeight,
              alignment: Alignment.centerRight,
            ),
          ),
        ),
      ],
    );
  }
}
